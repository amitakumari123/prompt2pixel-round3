const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 1. Official Mongoose Schema for MongoDB / MongoDB Atlas
const WasteReportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
      default: 'Pending'
    },
    reportedBy: {
      type: String,
      default: 'Citizen Demo',
      trim: true
    },
    priorityScore: {
      type: Number,
      default: 50
    },
    priorityFactors: {
      type: [String],
      default: []
    },
    assignedTeam: {
      type: String,
      default: 'Subterranean Pod Alpha'
    },
    estimatedKg: {
      type: Number,
      default: 45
    },
    diversionPotential: {
      type: Number,
      default: 75
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

WasteReportSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const RealMongooseModel = mongoose.model('WasteReport', WasteReportSchema);

// 2. Persistent Backend Document Store (Used when MongoDB is offline / local development)
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'reports.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readStoredReports() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading reports file, resetting:', err);
    return [];
  }
}

function writeStoredReports(reports) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf-8');
}

// In-Memory / File Document Class to mirror Mongoose Model instances
class LocalDocument {
  constructor(data) {
    this._id = data._id || crypto.randomBytes(12).toString('hex');
    this.reportId = data.reportId;
    this.category = data.category;
    this.description = data.description;
    this.location = data.location;
    this.priority = data.priority || 'Medium';
    this.status = data.status || 'Pending';
    this.reportedBy = data.reportedBy || 'Citizen Demo';
    this.priorityScore = data.priorityScore !== undefined ? data.priorityScore : 50;
    this.priorityFactors = data.priorityFactors || [];
    this.assignedTeam = data.assignedTeam || 'Subterranean Pod Alpha';
    this.estimatedKg = data.estimatedKg !== undefined ? data.estimatedKg : 45;
    this.diversionPotential = data.diversionPotential !== undefined ? data.diversionPotential : 75;
    this.resolvedAt = data.resolvedAt ? new Date(data.resolvedAt) : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  toJSON() {
    return {
      _id: this._id,
      id: this._id,
      reportId: this.reportId,
      category: this.category,
      description: this.description,
      location: this.location,
      priority: this.priority,
      status: this.status,
      reportedBy: this.reportedBy,
      priorityScore: this.priorityScore,
      priorityFactors: this.priorityFactors,
      assignedTeam: this.assignedTeam,
      estimatedKg: this.estimatedKg,
      diversionPotential: this.diversionPotential,
      resolvedAt: this.resolvedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  async save() {
    this.updatedAt = new Date();
    const reports = readStoredReports();
    const existingIndex = reports.findIndex(r => r.reportId === this.reportId || r._id === this._id);
    if (existingIndex >= 0) {
      reports[existingIndex] = this.toJSON();
    } else {
      reports.push(this.toJSON());
    }
    writeStoredReports(reports);
    return this;
  }
}

// 3. Unified Model Proxy: Routes to Mongoose if MongoDB connected, else to Persistent Local Store
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

class UnifiedWasteReport {
  constructor(data) {
    if (isMongoConnected()) {
      return new RealMongooseModel(data);
    }
    return new LocalDocument(data);
  }

  static find(filter = {}) {
    if (isMongoConnected()) {
      return RealMongooseModel.find(filter);
    }

    class LocalQuery {
      constructor(filter) {
        this.filter = filter;
        this.sortOption = null;
      }

      sort(sortObj) {
        this.sortOption = sortObj;
        return this;
      }

      async exec() {
        let reports = readStoredReports().map(r => new LocalDocument(r));

        if (this.filter.status) {
          if (typeof this.filter.status === 'object' && this.filter.status.$in) {
            reports = reports.filter(r => this.filter.status.$in.includes(r.status));
          } else if (typeof this.filter.status === 'object' && this.filter.status.$ne) {
            reports = reports.filter(r => r.status !== this.filter.status.$ne);
          } else if (typeof this.filter.status === 'string') {
            reports = reports.filter(r => r.status === this.filter.status);
          }
        }

        if (this.filter.category && typeof this.filter.category === 'string') {
          reports = reports.filter(r => r.category === this.filter.category);
        }

        if (this.filter.priority && typeof this.filter.priority === 'string') {
          reports = reports.filter(r => r.priority === this.filter.priority);
        }

        if (this.filter.reportedBy && this.filter.reportedBy instanceof RegExp) {
          reports = reports.filter(r => this.filter.reportedBy.test(r.reportedBy));
        }

        if (this.filter.$or && Array.isArray(this.filter.$or)) {
          reports = reports.filter(r => {
            return this.filter.$or.some(clause => {
              for (const key of Object.keys(clause)) {
                const val = r[key];
                const pattern = clause[key];
                if (pattern instanceof RegExp) {
                  if (pattern.test(val || '')) return true;
                }
              }
              return false;
            });
          });
        }

        if (this.sortOption) {
          if (this.sortOption.createdAt === -1) {
            reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          } else if (this.sortOption.createdAt === 1) {
            reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          }
        }
        return reports;
      }

      then(onFulfilled, onRejected) {
        return this.exec().then(onFulfilled, onRejected);
      }

      catch(onRejected) {
        return this.exec().catch(onRejected);
      }
    }

    return new LocalQuery(filter);
  }

  static async findOne(query = {}) {
    if (isMongoConnected()) {
      return RealMongooseModel.findOne(query);
    }
    const reports = readStoredReports();
    const found = reports.find(r => {
      for (const key of Object.keys(query)) {
        if (r[key] !== query[key]) return false;
      }
      return true;
    });
    return found ? new LocalDocument(found) : null;
  }

  static async findById(id) {
    if (isMongoConnected()) {
      return RealMongooseModel.findById(id);
    }
    const reports = readStoredReports();
    const found = reports.find(r => r._id === id || r.reportId === id);
    return found ? new LocalDocument(found) : null;
  }

  static async findOneAndUpdate(query, update, options = {}) {
    if (isMongoConnected()) {
      return RealMongooseModel.findOneAndUpdate(query, update, options);
    }
    const reports = readStoredReports();
    const index = reports.findIndex(r => {
      for (const key of Object.keys(query)) {
        if (r[key] !== query[key]) return false;
      }
      return true;
    });

    if (index === -1) return null;

    const current = reports[index];
    const updated = {
      ...current,
      ...update,
      updatedAt: new Date()
    };
    reports[index] = updated;
    writeStoredReports(reports);
    return new LocalDocument(updated);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    if (isMongoConnected()) {
      return RealMongooseModel.findByIdAndUpdate(id, update, options);
    }
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  static async deleteMany(query = {}) {
    if (isMongoConnected()) {
      return RealMongooseModel.deleteMany(query);
    }
    if (Object.keys(query).length === 0) {
      writeStoredReports([]);
      return { acknowledged: true, deletedCount: 0 };
    }
    const reports = readStoredReports();
    const kept = reports.filter(r => {
      for (const key of Object.keys(query)) {
        if (r[key] === query[key]) return false;
      }
      return true;
    });
    writeStoredReports(kept);
    return { acknowledged: true, deletedCount: reports.length - kept.length };
  }

  static async countDocuments(query = {}) {
    if (isMongoConnected()) {
      return RealMongooseModel.countDocuments(query);
    }
    const items = await this.find(query);
    return items.length;
  }
}

module.exports = UnifiedWasteReport;
