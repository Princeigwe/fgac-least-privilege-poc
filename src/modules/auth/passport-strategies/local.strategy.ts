import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) { 
    super({usernameField: "email"}) // this replaces the default username field for the email field
  }

  async validate(email: string, password: string) {
    const user = await this.authService.getValidatedUser(email, password)
    return user
  }
}