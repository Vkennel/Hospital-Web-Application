"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsInstance = void 0;
const { DataTypes, Model } = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const hospitalReportModel_1 = require("../model/hospitalReportModel");
class DoctorsInstance extends Model {
}
exports.DoctorsInstance = DoctorsInstance;
DoctorsInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    DoctorsName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Full name is required",
            },
            notEmpty: {
                msg: "Provide the full name",
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email is required",
            },
            isEmail: {
                msg: "Provide the valid email",
            },
        },
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            notNull: {
                msg: "specialization is required",
            },
            isAlpha: {
                msg: "Provide the valid specialization",
            },
        },
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Phone number is required",
            },
            isNumeric: {
                msg: "Provide the valid phone number",
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: database_config_1.default,
    tableName: "Doctors",
});
DoctorsInstance.hasMany(hospitalReportModel_1.patientInstance, { foreignKey: 'doctorId', as: 'Report' });
hospitalReportModel_1.patientInstance.belongsTo(DoctorsInstance, { foreignKey: 'doctorId', as: 'Doctors' });
