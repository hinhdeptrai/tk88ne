const mongoose = require("mongoose");
const { MIN_BET_MONEY, STATUS_BET_GAME, STATUS_HISTORY_GAME } = require("../configs/game.keno");

const lichSuDatCuocKeno3PSchema = new mongoose.Schema(
  {
    phien: {
      type: mongoose.Schema.ObjectId,
      ref: "GameKeno3P",
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
    collection: "LichSuDatCuocKeno3P",
    timestamps: true,
  }
);

const LichSuDatCuocKeno3P = mongoose.models.LichSuDatCuocKeno3P || mongoose.model("LichSuDatCuocKeno3P", lichSuDatCuocKeno3PSchema);
module.exports = LichSuDatCuocKeno3P;
