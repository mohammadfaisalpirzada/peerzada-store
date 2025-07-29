import React, { useState, useEffect } from 'react';
import { StringInputProps, useClient, set, unset, useFormValue } from 'sanity';

// Utility to slugify a string
function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '') // Remove all non-alphanumeric except -
    .replace(/-+/g, '-'); // Replace multiple - with single -
}

export const SubcategoryInput = React.forwardRef<HTMLSelectElement, StringInputProps>((props, ref) => {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: '2023-07-03' });
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Use useFormValue to reactively get the selected category reference
  const categoryRef = useFormValue(["category", "_ref"]);

  useEffect(() => {
    if (categoryRef) {
      setLoading(true);
      client.fetch(
        `*[_type == "category" && _id == $categoryId][0]{ 
          subcategories[]{
            title,
            value,
            icon,
            description
          }
        }`,
        { categoryId: categoryRef }
      ).then((category: any) => {
        if (category?.subcategories && category.subcategories.length > 0) {
          const processedSubcategories = category.subcategories.map((subcat: any) => ({
            ...subcat,
            value: subcat.value?.current || subcat.value || subcat.title?.toLowerCase().replace(/\s+/g, '-')
          }));
          setSubcategories(processedSubcategories);
        } else {
          setSubcategories([]);
        }
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
        setLoading(false);
      });
    } else {
      setSubcategories([]);
      // Clear subcategory value when no category is selected
      if (value) {
        onChange(unset());
      }
    }
  }, [categoryRef, client, onChange, value]);

  if (!categoryRef) {
    return (
      <div style={{
        padding: '12px',
        background: '#f7f8f9',
        borderRadius: '4px',
        color: '#666',
        border: '1px solid #e1e3e6',
        fontSize: '14px'
      }}>
        📂 Please select a category first to see subcategories
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        padding: '12px',
        background: '#f7f8f9',
        borderRadius: '4px',
        color: '#666',
        border: '1px solid #e1e3e6',
        fontSize: '14px'
      }}>
        ⏳ Loading subcategories...
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div style={{
        padding: '12px',
        background: '#f7f8f9',
        borderRadius: '4px',
        color: '#666',
        border: '1px solid #e1e3e6',
        fontSize: '14px'
      }}>
        ℹ️ No subcategories available for this category. Add some subcategories to this category first.
      </div>
    );
  }

  return (
    <div>
      <select
        ref={ref}
        value={value || ''}
        onChange={e => {
          const selected = subcategories.find(subcat => slugify(subcat.value) === slugify(e.target.value));
          const val = selected ? slugify(selected.value) : '';
          if (val) {
            onChange(set(val));
          } else {
            onChange(unset());
          }
        }}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #e1e3e6',
          borderRadius: '4px',
          fontSize: '14px',
          background: 'white',
          cursor: 'pointer'
        }}
      >
        <option value="">-- Select a subcategory (optional) --</option>
        {subcategories.map(subcat => (
          <option key={slugify(subcat.value)} value={slugify(subcat.value)}>
            {subcat.title}
          </option>
        ))}
      </select>
      {value && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: '#e8f5e8',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#2d5a2d'
        }}>
          ✅ Selected: {subcategories.find(s => slugify(s.value) === slugify(value))?.title || value}
        </div>
      )}
    </div>
  );
});

SubcategoryInput.displayName = 'SubcategoryInput';