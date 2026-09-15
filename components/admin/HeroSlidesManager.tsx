"use client";

import React, { useState, useEffect } from "react";
import { getHeroSlidesAdmin, createHeroSlide, updateHeroSlide, deleteHeroSlide, getMediaUrl } from "@/lib/api";
import type { HeroSlide } from "../productData";
import { IconPlus, IconEdit, IconTrash, IconClose, IconPhoto, IconArrowRight } from "../icons";

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [modal, setModal] = useState<{ mode: "create" | "edit"; slide?: HeroSlide } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("Shop now");
  const [buttonLink, setButtonLink] = useState("/shop");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const load = async () => {
    const data = await getHeroSlidesAdmin();
    setSlides(data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const openCreate = () => {
    setTitle("");
    setSubtitle("");
    setButtonText("Shop now");
    setButtonLink("/shop");
    setOrder(slides.length);
    setIsActive(true);
    setImageFile(null);
    setImagePreview(null);
    setModal({ mode: "create" });
  };

  const openEdit = (slide: HeroSlide) => {
    setTitle(slide.title);
    setSubtitle(slide.subtitle || "");
    setButtonText(slide.button_text || slide.buttonText || "Shop now");
    setButtonLink(slide.button_link || slide.buttonLink || "/shop");
    setOrder(slide.order ?? 0);
    setIsActive(slide.is_active !== false);
    setImageFile(null);
    setImagePreview(slide.image ? getMediaUrl(slide.image) : null);
    setModal({ mode: "edit", slide });
  };

  const closeModal = () => setModal(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    const data = new FormData();
    data.append("title", title.trim());
    data.append("subtitle", subtitle.trim());
    data.append("button_text", buttonText.trim());
    data.append("button_link", buttonLink.trim());
    data.append("order", String(order));
    data.append("is_active", String(isActive));
    if (imageFile) data.append("image_file", imageFile);

    let res;
    if (modal?.mode === "edit" && modal.slide) {
      res = await updateHeroSlide(modal.slide.id, data);
    } else {
      res = await createHeroSlide(data);
    }

    setSaving(false);
    if (res.success) {
      setToast(modal?.mode === "edit" ? `"${title}" updated.` : `"${title}" added.`);
      closeModal();
      await load();
    } else {
      setToast(res.error || "Something went wrong saving this slide.");
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    const data = new FormData();
    data.append("is_active", String(!(slide.is_active !== false)));
    const res = await updateHeroSlide(slide.id, data);
    if (res.success) {
      await load();
    } else {
      setToast("Couldn't update this slide.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteHeroSlide(deleteTarget.id);
    if (res.success) {
      setToast(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await load();
    } else {
      setToast("Couldn't delete this slide.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
            Hero Slides
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B]">
            Manage the homepage hero carousel. Only active slides show on the storefront.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add Slide</span>
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#8A84A6] py-10 text-center">Loading slides...</p>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#D9CEEE] py-16 text-center">
          <p className="text-sm font-semibold text-[#171136]">No hero slides yet.</p>
          <p className="text-xs text-[#8A84A6] mt-1">Add one to start filling the homepage carousel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {slides.map((slide) => {
            const active = slide.is_active !== false;
            return (
              <div key={slide.id} className="bg-white rounded-3xl border border-[#EAE3F7] overflow-hidden shadow-xs">
                <div className="relative w-full aspect-[1072/460] bg-[#F6F1FF]">
                  {slide.image ? (
                    <img src={getMediaUrl(slide.image)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C7C0E8]">
                      <IconPhoto className="w-8 h-8" />
                    </div>
                  )}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      active ? "bg-[#0FA968] text-white" : "bg-[#171136]/70 text-white"
                    }`}
                  >
                    {active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="p-4">
                  <p className="font-bold text-sm text-[#171136] truncate">{slide.title}</p>
                  {slide.subtitle && (
                    <p className="text-[11.5px] text-[#736E9B] mt-0.5 line-clamp-2">{slide.subtitle}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-[#7B5CFF]">
                    <span className="truncate">{slide.button_text || slide.buttonText}</span>
                    <IconArrowRight className="w-3 h-3 shrink-0" />
                    <span className="text-[#8A84A6] font-mono truncate">{slide.button_link || slide.buttonLink}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0EBF8]">
                    <button
                      onClick={() => toggleActive(slide)}
                      title={active ? "Turn off" : "Turn on"}
                      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${active ? "bg-[#FF4D6D]" : "bg-[#E3DEF2]"}`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          active ? "translate-x-4.5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(slide)}
                        title="Edit"
                        className="w-7 h-7 rounded-lg bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center cursor-pointer"
                      >
                        <IconEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(slide)}
                        title="Delete"
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                {modal.mode === "edit" ? "Edit Slide" : "Add Slide"}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171136] block mb-1">Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build your own universe."
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1">Subtitle</label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Anime figures, cartoon collectibles, brick sets & coding kits."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Button text</label>
                  <input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Shop now"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Button link</label>
                  <input
                    value={buttonLink}
                    onChange={(e) => setButtonLink(e.target.value)}
                    placeholder="/shop"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] font-mono focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1.5">Image</label>
                {imagePreview ? (
                  <div className="relative w-full aspect-[1072/460] rounded-2xl overflow-hidden border border-[#EAE3F7]">
                    <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                    <label className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-xl bg-white/95 border border-[#EAE3F7] text-[11px] font-bold text-[#7B5CFF] hover:bg-white cursor-pointer">
                      Change
                      <input type="file" accept="image/*,.svg" onChange={handleImageFile} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border-2 border-dashed border-[#D9CEEE] hover:border-[#FF4D6D] bg-[#FAF8FE] hover:bg-[#FFF5F7] transition-all cursor-pointer">
                    <input type="file" accept="image/*,.svg" onChange={handleImageFile} className="hidden" />
                    <IconPhoto className="w-4 h-4 text-[#7B5CFF]" />
                    <span className="font-semibold text-[#171136]">Upload a banner image</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#FF4D6D]" />
                    <span className="font-semibold text-[#171136]">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EBF8]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#171136] text-white font-bold hover:bg-[#251c4a] shadow-md cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : modal.mode === "edit" ? "Save Changes" : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mb-1">
              Delete slide?
            </h3>
            <p className="text-xs text-[#736E9B] mb-5">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#171136] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
}
