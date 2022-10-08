"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientInstance = void 0;
const { DataTypes, Model } = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class patientInstance extends Model {
}
exports.patientInstance = patientInstance;
patientInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    hospitalName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: false
    },
    height: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bloodGroup: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genotype: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bloodPressure: {
        type: DataTypes.STRING,
        allowNull: false
    },
    HIV_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hepatitis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: database_config_1.default,
    tableName: "Patient Report"
});
