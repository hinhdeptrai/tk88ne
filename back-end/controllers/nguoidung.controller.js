const NguoiDung = require("../models/NguoiDung");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { NotFoundError, UnauthorizedError, BadRequestError } = require("../utils/app_error");
const catchAsync = require("../utils/catch_async");
const { OkResponse, CreatedResponse } = require("../utils/successResponse");
const { selectFields, unSelectFields } = require("../utils/selectFieldsObject");
const ms = require("ms");
const { signToken } = require("../utils/signToken");
const { JWT_SECRET_KEY } = require("../configs/jwt.config");
const { USER_ROLE } = require("../configs/user.config");
class NguoiDungController {
  static getDetailedUser = catchAsync(async (req, res, next) => {
    const { taiKhoan } = req.user;
    const user = await NguoiDung.findOne({ taiKhoan }).select("-matKhau -__v -refreshToken").lean();
    if (!user) {
      throw new NotFoundError(`Không tồn tại tài khoản: ${taiKhoan}`);
    }
    return new OkResponse({
      data: user,
    }).send(res);
  });
  static refreshToken = catchAsync(async (req, res, next) => {
    const { taiKhoan } = req.user;
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    try {
      const checkRefreshTokenValid = await NguoiDung.findOne({ refreshToken: { $in: refreshToken }, taiKhoan });
      if (!checkRefreshTokenValid) {
        return next(new BadRequestError("Refresh token không tồn tại"));
      }
      const decodeRefreshToken = jwt.verify(refreshToken, JWT_SECRET_KEY);

      // Tạo mới token

      const newToken = signToken({
        taiKhoan: checkRefreshTokenValid.taiKhoan,
        role: checkRefreshTokenValid.role,
        id: checkRefreshTokenValid._id,
      });
      // Update database
      await Promise.all([
        NguoiDung.findOneAndUpdate(
          { taiKhoan },
          {
            $pull: { refreshToken: refreshToken },
          }
        ),
        NguoiDung.findOneAndUpdate(
          { taiKhoan },
          {
            $push: { refreshTokenUsed: refreshToken, refreshToken: newToken.refreshToken },
          }
        ),
      ]);

      return new OkResponse({
        data: newToken,
      }).send(res);
    } catch (err) {
      console.log(err);
      throw new BadRequestError("Refresh token đã hết hạn hoặc không tồn tại!");
    }
  });

  static createUser = catchAsync(async (req, res, next) => {
    const { taiKhoan, matKhau, nhapLaiMatKhau } = req.body;
    if (!taiKhoan || !matKhau || !nhapLaiMatKhau) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const checkUserExist = await NguoiDung.findOne({
      taiKhoan,
    });
    if (checkUserExist) {
      throw new BadRequestError("Nguời dùng đã tồn tại");
    }
    let result;
    const countUser = await NguoiDung.countDocuments({});
    if (countUser === 0) {
      result = await NguoiDung.create({
        taiKhoan,
        matKhau,
        nhapLaiMatKhau,
        role: USER_ROLE.ADMIN,
      });
    } else {
      result = await NguoiDung.create({
        taiKhoan,
        matKhau,
        nhapLaiMatKhau,
      });
    }
    return new CreatedResponse({
      data: result,
      message: "Đăng ký tài khoản thành công. Đang tiến hành đăng nhập",
    }).send(res);
  });

  static signInUser = catchAsync(async (req, res, next) => {
    const { taiKhoan, matKhau } = req.body;
    if (!taiKhoan || !matKhau) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const user = await NguoiDung.findOne({
      taiKhoan,
    }).lean();
    if (!user) {
      throw new BadRequestError("Nguời dùng không tồn tại");
    }
    const authPassword = await bcrypt.compare(matKhau, user.matKhau);
    if (!authPassword) {
      throw new BadRequestError("Mật khẩu không chính xác");
    }
    // Sign token

    const { accessToken, refreshToken, expireAccessToken } = signToken({
      taiKhoan: user.taiKhoan,
      role: user.role,
      id: user._id,
    });

    // Update refresh token DB
    await NguoiDung.findOneAndUpdate(
      {
        taiKhoan,
      },
      {
        $push: { refreshToken: refreshToken },
      }
    );
    return new OkResponse({
      data: {
        data: unSelectFields({ fields: ["matKhau", "__v", "refreshToken", "refreshTokenUsed"], object: user }),
        accessToken,
        refreshToken,
        expireAccessToken,
      },
      message: "Đăng nhập thành công",
    }).send(res);
  });
  static signOutUser = catchAsync(async (req, res, next) => {
    const { taiKhoan } = req.user;
    const { refreshToken } = req.body;

    await NguoiDung.findOneAndUpdate(
      {
        taiKhoan,
      },
      {
        $pull: {
          refreshToken: refreshToken,
        },
      }
    );

    return new OkResponse({
      message: "Đăng xuất thành công",
    }).send(res);
  });
}

module.exports = NguoiDungController;
