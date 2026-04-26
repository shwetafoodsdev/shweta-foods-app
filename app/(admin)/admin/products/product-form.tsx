"use client";

import { saveAdminProduct } from "@/lib/actions/admin.actions";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useActionState, useEffect, useMemo, useRef, useState } from "react";

type ProductFormData = {
  id?: string;
  name?: string;
  slug?: string;
  category?: string;
  brand?: string;
  price?: number;
  stock?: number;
  images?: string[];
  isVisiable?: boolean;
  isDealOfDay?: boolean;
  dealEndsAt?: Date | string | null;
  description?: string;
  banner?: string | null;
  rating?: number;
};

const ProductForm = ({ product }: { product?: ProductFormData | null }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dealEnabled, setDealEnabled] = useState(Boolean(product?.isDealOfDay));
  const [state, formAction, isPending] = useActionState(saveAdminProduct, null);

  const initialDealHours = useMemo(() => {
    if (!product?.dealEndsAt) {
      return 24;
    }

    const endDate = new Date(product.dealEndsAt);
    const diff = endDate.getTime() - Date.now();
    return diff > 0 ? Math.max(1, Math.ceil(diff / (60 * 60 * 1000))) : 24;
  }, [product?.dealEndsAt]);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/products");
      router.refresh();
    }
  }, [router, state]);

  const previewImages = useMemo(() => {
    const selectedPreviews = selectedFiles.map((file) => ({
      kind: "new" as const,
      key: `${file.name}-${file.lastModified}`,
      label: file.name,
      src: URL.createObjectURL(file),
    }));

    const existingPreviews = existingImages.map((image, index) => ({
      kind: "existing" as const,
      key: `${image}-${index}`,
      label: `Current image ${index + 1}`,
      src: image,
    }));

    return [...existingPreviews, ...selectedPreviews];
  }, [existingImages, selectedFiles]);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => {
        if (image.src.startsWith("blob:")) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, [previewImages]);

  const syncSelectedFiles = (files: File[]) => {
    setSelectedFiles(files);

    if (!fileInputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    syncSelectedFiles([...selectedFiles, ...Array.from(event.target.files ?? [])]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    syncSelectedFiles([...selectedFiles, ...Array.from(event.dataTransfer.files ?? [])]);
  };

  const removeExistingImage = (imageSrc: string) => {
    setExistingImages((currentImages) => currentImages.filter((image) => image !== imageSrc));
  };

  const removeSelectedImage = (imageKey: string) => {
    syncSelectedFiles(
      selectedFiles.filter((file) => `${file.name}-${file.lastModified}` !== imageKey)
    );
  };

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" defaultValue={product?.id} />
      {existingImages.map((image) => (
        <input key={image} type="hidden" name="retainedImages" value={image} />
      ))}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <input name="name" className="mt-1 w-full rounded border px-3 py-2" defaultValue={product?.name || ""} required />
        </div>
        <div>
          <label className="text-sm font-medium">Slug *</label>
          <input name="slug" className="mt-1 w-full rounded border px-3 py-2" defaultValue={product?.slug || ""} required />
        </div>
        <div>
          <label className="text-sm font-medium">Category *</label>
          <input name="category" className="mt-1 w-full rounded border px-3 py-2" defaultValue={product?.category || ""} required />
        </div>
        <div>
          <label className="text-sm font-medium">Brand *</label>
          <input name="brand" className="mt-1 w-full rounded border px-3 py-2" defaultValue={product?.brand || ""} required />
        </div>
        <div>
          <label className="text-sm font-medium">Price *</label>
          <input type="number" name="price" className="mt-1 w-full rounded border px-3 py-2" defaultValue={product?.price || 0} required />
        </div>
        <div>
          <label className="text-sm font-medium">Stock *</label>
          <input type="number" name="stock" className="mt-1 w-full rounded border px-3 py-2" defaultValue={product?.stock || 0} required />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Product Images *</label>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-1 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
            isDragging ? "border-slate-900 bg-slate-50" : "border-slate-300"
          }`}
        >
          <p className="font-medium">Drag and drop image files here</p>
          <p className="mt-1 text-sm text-muted-foreground">or click to select PNG, JPG, JPEG, WEBP, GIF, AVIF, or BMP files</p>
        </div>
        <input
          ref={fileInputRef}
          name="imageFiles"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/avif,image/bmp"
          className="hidden"
          onChange={handleFileChange}
        />
        {selectedFiles.length ? (
          <button
            type="button"
            className="mt-3 rounded border px-3 py-1.5 text-sm"
            onClick={() => syncSelectedFiles([])}
          >
            Clear Selected Images
          </button>
        ) : null}
        {previewImages.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {previewImages.map((image) => (
              <div key={image.key} className="relative overflow-hidden rounded-lg border bg-white">
                <button
                  type="button"
                  onClick={() => {
                    if (image.kind === "existing") {
                      removeExistingImage(image.src);
                      return;
                    }
                    removeSelectedImage(image.key);
                  }}
                  className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-1 text-white transition hover:bg-black"
                  aria-label={`Remove ${image.label}`}
                >
                  <X className="size-4" />
                </button>
                <img src={image.src} alt={image.label} className="h-40 w-full object-cover" />
                <p className="truncate border-t px-3 py-2 text-xs text-muted-foreground">{image.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <label className="text-sm font-medium">Description *</label>
        <textarea
          name="description"
          className="mt-1 w-full rounded border px-3 py-2"
          rows={5}
          defaultValue={product?.description || ""}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Banner URL</label>
          <input name="banner" className="mt-1 w-full rounded border px-3 py-2" defaultValue={product?.banner || ""} />
        </div>
        <div className="pt-6">
          <label className="flex items-center gap-2">
            <input name="isVisiable" type="checkbox" defaultChecked={product?.isVisiable ?? true} />
            Is Visiable?
          </label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="pt-2">
          <label className="flex items-center gap-2">
            <input
              name="isDealOfDay"
              type="checkbox"
              defaultChecked={product?.isDealOfDay}
              onChange={(event) => setDealEnabled(event.target.checked)}
            />
            Mark as Deal of the Day
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Only one product can be active as the home page deal at a time.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Deal Countdown Hours</label>
          <input
            type="number"
            min="1"
            step="1"
            name="dealCountdownHours"
            className="mt-1 w-full rounded border px-3 py-2"
            defaultValue={initialDealHours}
            disabled={!dealEnabled}
          />
        </div>
      </div>
      <div>
        <div>
          <label className="text-sm font-medium">Rating *</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            name="rating"
            className="mt-1 w-full rounded border px-3 py-2"
            defaultValue={product?.rating ?? 5}
            required
          />
        </div>
      </div>
      {state && !state.success ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <button className="rounded bg-slate-900 px-5 py-2 text-white disabled:opacity-70" type="submit" disabled={isPending}>
        {product?.id ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
