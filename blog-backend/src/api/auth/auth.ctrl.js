import Joi from 'joi';
import { clearCache } from '../../../node_modules/nodeman/lib/mustache';
import User from '../../models/user';

/*
POST /api/auth/register
{
    username: 'hyebinyu1110',
    password: "Hby636*2488"
}
*/
export const register = async ctx => {
    // Request Body 검증하기
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try {
        // username이 이미 존재하는지 확인
        const exists = await User.findByUsername(username);
        if (exists) {
            ctx.status = 409; // conflict
            return;
        }

        const user = new User({
            username
        });
        await user.setPassword(password); // 비밀번호 설정
        await user.save();// 데이터베이스에 저장

        // 응답할 데이터에서 hashedPassword 필드 제거
        // const data = user.toJSON();
        // delete data.hashedPassword;
        ctx.body = user.serialize();
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
POST /api/auth/login
{
    username: "hyebinyu1110",
    password: "Hby636*2488"
}
*/
export const login = async ctx => {
    // 로그인
    const { username, password } = ctx.request.body;

    // username, password 가 없으면 에러 처리
    if (!username || !password) {
        ctx.status = 401; // Unauthorized
        return;
    }

    try {
        const user = await User.findByUsername(username);
        // 계정이 존재하지 않으면 에러처리
        if (!user) {
            ctx.status = 401;
            return;
        }

        const valid = await user.checkPassword(password);
        // 잘못된 비밀번호
        if (!valid) {
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
    } catch (e) {
        ctx.throw(500, e);
    }
}

export const check = async ctx => {
    //로그인 상태 확인
}

export const logout = async ctx => {
    //로그아웃
}
