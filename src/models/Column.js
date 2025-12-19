// src/models/Column.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Reuse existing connection if it exists (Next.js hot reload safe)
const ColumnSchema =
  mongoose.models.Column ||
  mongoose.model(
    'Column',
    new Schema(
      {
        // Human friendly name shown in UI, e.g. "To Do"
        title: {
          type: String,
          required: true,
          trim: true,
        },

        // Project this column belongs to
        projectId: {
          type: Schema.Types.ObjectId,
          ref: 'Project',
          required: true,
          index: true,
        },

        // Used by the frontend as a stable identifier (droppableId)
        key: {
          type: String,
          required: true,
          trim: true,
        },

        // Left-to-right order of the column in the board
        order: {
          type: Number,
          required: true,
          default: 0,
          index: true,
        },
      },
      {
        timestamps: true,
      }
    )
  );

export default ColumnSchema;
