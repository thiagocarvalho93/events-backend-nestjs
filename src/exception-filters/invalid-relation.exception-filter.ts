import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { InvalidRelationError } from 'src/errors/invalid-relation-error';

@Catch(InvalidRelationError)
export class InvalidRelationExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidRelationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
