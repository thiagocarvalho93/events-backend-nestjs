import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InvalidOperationError } from 'src/common/errors/invalid-operation-error';

@Catch(InvalidOperationError)
export class InvalidOperationExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidOperationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
