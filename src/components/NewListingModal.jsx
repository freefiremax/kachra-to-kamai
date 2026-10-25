import { useState } from 'react';
import { categoryRules } from '../data';
import { validateListingForm } from '../lib/marketplace';

const emptyForm = {
  title: '',
  description: '',
  category: 'recyclable',
  quantity: '',
  unit: 'kg',
  price: '',
  condition: 'Dry and sorted',
  area: 'Kopargaon',
};

export function NewListingModal({ onClose, onAddListing }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  function update(field, val) {
    setForm((curr) => ({ ...curr, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateListingForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const cat = categoryRules[form.category];
    const newListing = {
      id: `listing-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      price: Number(form.price),
      condition: form.condition.trim() || 'Verified condition',
      area: form.area.trim(),
      distanceKm: 4,
      seller: 'Demo Supplier Hub',
      image: cat?.icon || '📦',
      availability: 'Available now',
      handling: 'Standard covered light commercial vehicle suitable.',
    };

    onAddListing(newListing);
    onClose();
  }

  return (
    <div
      className="modal-backdrop glass-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal new-listing-dialog glass-modal" role="dialog" aria-modal="true">
        <div className="modal-drag-handle" />
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="new-listing-header">
          <span className="eyebrow glass-pill">SELLER INVENTORY</span>
          <h2>List Material for Sale</h2>
          <p>Describe your scrap, agricultural residue, or surplus items for local buyers.</p>
        </div>

        <form onSubmit={handleSubmit} className="new-listing-form">
          <div className="form-grid">
            <label className="field-group full">
              <span className="field-label">Listing Title *</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Clean corrugated cardboard bales"
                className={`portal-input glass-input ${errors.title ? 'has-error' : ''}`}
              />
              {errors.title && <small className="field-err">{errors.title}</small>}
            </label>

            <label className="field-group">
              <span className="field-label">Category *</span>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="portal-input glass-input"
              >
                {Object.entries(categoryRules)
                  .filter(([, cat]) => !cat.blocked)
                  .map(([key, cat]) => (
                    <option key={key} value={key}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Quantity *</span>
              <div className="qty-row">
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => update('quantity', e.target.value)}
                  placeholder="e.g. 150"
                  className={`portal-input glass-input ${errors.quantity ? 'has-error' : ''}`}
                />
                <select
                  value={form.unit}
                  onChange={(e) => update('unit', e.target.value)}
                  className="portal-input glass-input"
                >
                  <option value="kg">kg</option>
                  <option value="items">items</option>
                </select>
              </div>
              {errors.quantity && <small className="field-err">{errors.quantity}</small>}
            </label>

            <label className="field-group">
              <span className="field-label">Price per {form.unit} (₹) *</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="e.g. 14"
                className={`portal-input glass-input ${errors.price ? 'has-error' : ''}`}
              />
              {errors.price && <small className="field-err">{errors.price}</small>}
            </label>

            <label className="field-group">
              <span className="field-label">Pickup Hub / Area *</span>
              <input
                type="text"
                value={form.area}
                onChange={(e) => update('area', e.target.value)}
                placeholder="e.g. Station Road, Kopargaon"
                className={`portal-input glass-input ${errors.area ? 'has-error' : ''}`}
              />
              {errors.area && <small className="field-err">{errors.area}</small>}
            </label>

            <label className="field-group full">
              <span className="field-label">Description & Intended Next Use *</span>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe material cleanliness, packing, and loading access..."
                className={`portal-input glass-input ${errors.description ? 'has-error' : ''}`}
              />
              {errors.description && <small className="field-err">{errors.description}</small>}
            </label>
          </div>

          <div className="modal-actions-bar" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="ktk-hero-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ktk-hero-btn-primary">
              Publish Listing ➔
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
