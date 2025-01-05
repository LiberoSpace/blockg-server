import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { env } from "process";
import { Observable } from "rxjs";
import { FirebaseAdmin } from "../firebase.service";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private firebaseAdmin: FirebaseAdmin) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;

        if (!token) {
            throw new UnauthorizedException('파이어베이스 토큰이 없습니다.')
        }

        try {
            request.decodedIdToken = await this.firebaseAdmin.auth().verifyIdToken(token)
        }
        catch (e) {
            console.error(e);
            switch (e.code) {
                case 'auth/id-token-expired':
                    throw new UnauthorizedException('제공된 Firebase ID 토큰이 만료되었습니다.')
                case 'auth/id-token-revoked':
                    throw new UnauthorizedException('Firebase ID 토큰이 취소되었습니다.')
                default:
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        errorType: 'firebase-auth',
                        code: e.code,
                        error: e.message,
                        referenceUrl: 'https://firebase.google.com/docs/auth/admin/errors?hl=ko&_gl=1*7sq4th*_up*MQ..*_ga*Mzk1MTgyODQwLjE3MzU5MTQyNTM.*_ga_CW55HF8NVT*MTczNTkxNDI1Mi4xLjAuMTczNTkxNDI1Mi4wLjAuMA..'
                    }, HttpStatus.BAD_REQUEST, {
                        cause: e
                    });
            }

        }
        return true;
    }
}