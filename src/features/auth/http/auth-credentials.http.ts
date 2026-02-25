import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import {
  ConnectCredentialsSchema,
  LoginSchema,
  RegisterSchema,
  validateAuthCredentialsForm,
  ValidateAuthCredentialsForm,
} from "../schemas/auth-credentials.schema";

interface AuthCredentialsHttpContract {
  validateFormData(req: Request, forEndpoint: "LOGIN"): Promise<LoginSchema>;
  validateFormData(req: Request, forEndpoint: "REGISTER"): Promise<RegisterSchema>;
  validateFormData(req: Request, forEndpoint: "CONNECT"): Promise<ConnectCredentialsSchema>;
}

type ForEndpoint = ValidateAuthCredentialsForm["forEndpoint"];

export const AuthCredentialsHttp: AuthCredentialsHttpContract = {
  async validateFormData<T>(req: Request, forEndpoint: ForEndpoint) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const parsed = await validateAuthCredentialsForm({ forEndpoint, input });

    if (parsed.isError) throw new ResourceUnprocessableEntity("Please check your form", parsed.errors!);
    return parsed.data as T;
  },
};
