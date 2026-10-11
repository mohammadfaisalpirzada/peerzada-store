'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaTimes, FaCamera, FaSpinner, FaCheck, FaEdit } from 'react-icons/fa';

export interface EditableProduct {
  _id: string;
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
  brand?: string;
  color?: string;
}

interface ProductEditModalProps {
  product: EditableProduct;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: Partial<EditableProduct>) => void;
}

export default function ProductEditModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductEditModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState(product.title || '');
  const [price, setPrice] = useState(product.price ? String(product.price) : '0');
  const [description, setDescription] = useState(product.description || '');
  const [inStock, setInStock] = useState(product.inStock !== false);
  const [brand, setBrand] = useState(product.brand || '');
  const [color, setColor] = useState(product.color || '');

  // Image handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [useUrlMode, setUseUrlMode] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('productId', product._id);
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('inStock', inStock ? 'true' : 'false');
      if (brand) formData.append('brand', brand);
      if (color) formData.append('color', color);

      if (selectedFile) {
        formData.append('imageFile', selectedFile);
      } else if (useUrlMode && imageUrlInput.trim()) {
        formData.append('imageUrl', imageUrlInput.trim());
      }

      const res = await fetch('/api/admin/products/update', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      setSuccessMsg('Product updated successfully!');

      if (onSuccess) {
        onSuccess({
          title,
          price: parseFloat(price) || product.price,
          description,
          inStock,
          brand,
          color,
          imageUrl: previewUrl || (imageUrlInput.trim() ? imageUrlInput.trim() : product.imageUrl),
        });
      }

      setTimeout(() => {
        router.refresh();
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Save error:', err);
      setError(err?.message || 'Something went wrong while saving changes.');
    } finally {
      setLoading(false);
    }
  };

  const currentDisplayImage = previewUrl || (useUrlMode && imageUrlInput.trim() ? imageUrlInput.trim() : product.imageUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-[#B80000] flex items-center justify-center">
              <FaEdit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Direct Product Editor</h2>
              <p className="text-xs text-gray-500">Admin quick access: Edit photo & details directly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-semibold flex items-center gap-2">
              <FaCheck className="w-4 h-4 text-green-600" />
              {successMsg}
            </div>
          )}

          {/* Picture Change Section */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Product Picture (Change Directly)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Image Preview */}
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gray-200 border-2 border-dashed border-gray-300 flex-shrink-0">
                {currentDisplayImage ? (
                  <Image
                    src={currentDisplayImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
                {selectedFile && (
                  <span className="absolute bottom-1 right-1 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    New
                  </span>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 w-full space-y-2">
                {!useUrlMode ? (
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-xl border border-gray-300 shadow-sm transition-all hover:border-gray-400">
                      <FaCamera className="text-[#B80000]" />
                      <span>{selectedFile ? 'Select Different Photo' : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {selectedFile && (
                      <p className="text-[11px] text-green-700 font-medium mt-1 truncate">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B80000]/30"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setUseUrlMode(!useUrlMode);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-[#B80000] hover:underline font-medium"
                  >
                    {useUrlMode ? 'Switch to File Upload' : 'Or paste an Image URL'}
                  </button>
                  {(selectedFile || previewUrl) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-gray-500 hover:text-red-600 hover:underline"
                    >
                      Reset Picture
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Title & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B80000]/30 focus:border-[#B80000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Price (PKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B80000]/30 focus:border-[#B80000]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B80000]/30 focus:border-[#B80000] resize-y"
            />
          </div>

          {/* Stock & Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                id="stockToggle"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-[#B80000] rounded focus:ring-[#B80000]"
              />
              <label htmlFor="stockToggle" className="text-xs font-bold text-gray-800 cursor-pointer">
                {inStock ? '✅ In Stock' : '❌ Out of Stock'}
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Color (optional)</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black / Brown"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B80000]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Brand (optional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Peerzada"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B80000]/30"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B80000] hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-3.5 h-3.5" />
                  <span>Saving to Sanity...</span>
                </>
              ) : (
                <>
                  <FaCheck className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
