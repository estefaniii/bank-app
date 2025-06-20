'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.JwtAdapter = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const envs_1 = require('./envs');
class JwtAdapter {
  static generateToken(payload_1) {
    return __awaiter(
      this,
      arguments,
      void 0,
      function* (payload, duration = '3h') {
        return new Promise((resolve) => {
          jsonwebtoken_1.default.sign(
            payload,
            envs_1.envs.JWT_KEY,
            { expiresIn: duration },
            (error, token) => {
              if (error) return resolve(null);
              resolve(token);
            },
          );
        });
      },
    );
  }
  static validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve) => {
        jsonwebtoken_1.default.verify(
          token,
          envs_1.envs.JWT_KEY,
          (err, decoded) => {
            if (err) return resolve(null);
            resolve(decoded);
          },
        );
      });
    });
  }
}
exports.JwtAdapter = JwtAdapter;
