'use client';

import { useState } from 'react';
import { getAllTemplates } from '@/lib/templates';

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  const templates = getAllTemplates();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Choose a Template
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={`relative rounded-xl border-2 p-4 text-left transition-all hover:border-[#3d348b] hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-[#3d348b] bg-[#3d348b]/5 ring-2 ring-[#3d348b]/20'
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* Selected Badge */}
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#3d348b] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Template Content */}
            <div className="flex items-start gap-3 pr-8">
              <span className="text-3xl">{template.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {template.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span>{template.columns.length} columns</span>
                  <span>•</span>
                  <span>{template.tasks.length} tasks</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
