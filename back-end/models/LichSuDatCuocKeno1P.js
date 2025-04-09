const mongoose = require("mongoose");
const { MIN_BET_MONEY, STATUS_BET_GAME, STATUS_HISTORY_GAME } = require("../configs/game.keno");

const lichSuDatCuocKeno1PSchema = new mongoose.Schema(
  {
    phien: {
      type: mongoose.Schema.ObjectId,
      ref: "GameKeno1P",
    },
    nguoiDung: {
      type: mongoose.Schema.ObjectId,
      ref: "NguoiDung",
    },
    datCuoc: [
      {
        loaiBi: { type: Number, enum: [1, 2, 3, 4, 5] },
        loaiCuoc: {
          type: String,
          enum: ["C", "L"],
        },
        tienCuoc: {
          type: Number,
          min: MIN_BET_MONEY,
          default: 0,
        },
        trangThai: {
          type: String,
          enum: Object.values(STATUS_BET_GAME),
          default: STATUS_BET_GAME.DANG_CHO,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    tinhTrang: {
      type: String,
      enum: Object.values(STATUS_HISTORY_GAME),
      default: STATUS_HISTORY_GAME.DANG_CHO,
    },
  },
  {
    collection: "LichSuDatCuocKeno1P",
    timestamps: true,
  }
);

const LichSuDatCuocKeno1P = mongoose.models.LichSuDatCuocKeno1P || mongoose.model("LichSuDatCuocKeno1P", lichSuDatCuocKeno1PSchema);
module.exports = LichSuDatCuocKeno1P;
