import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";

interface BrasilApiCepResponse {
  state: string;
  city: string;
}

@Injectable()
export class CepValidationService {
  async validate(cep: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response: Response;

    try {
      response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ServiceUnavailableException(
          "Tempo de validação do CEP esgotado. Tente novamente.",
        );
      }

      throw new ServiceUnavailableException(
        "Serviço de validação de CEP indisponível no momento.",
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      if (response.status === 400 || response.status === 404) {
        throw new BadRequestException("CEP inválido ou não encontrado.");
      }

      throw new BadGatewayException("Falha ao consultar serviço de CEP.");
    }

    const data = (await response.json()) as BrasilApiCepResponse;

    return {
      state: data.state,
      city: data.city,
    };
  }
}
