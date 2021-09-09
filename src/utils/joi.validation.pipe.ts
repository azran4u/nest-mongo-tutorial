import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Inject,
  mixin,
  Type,
  forwardRef,
} from "@nestjs/common";
import { ObjectSchema } from "joi";
import { memoize, MemoizedFunction } from "lodash";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

// @Injectable()
// export class JoiValidationPipe implements PipeTransform {
//   constructor(private schema: ObjectSchema) {}

//   transform(value: any, metadata: ArgumentMetadata) {
//     const { error } = this.schema.validate(value);
//     if (error) {
//       throw new BadRequestException(`Validation failed ${error.message}`);
//     }
//     return value;
//   }
// }

export const JoiValidationPipe: ((
  schema: ObjectSchema
) => Type<PipeTransform>) &
  MemoizedFunction = memoize(createJoiValidationPipe);

export function createJoiValidationPipe(
  schema: ObjectSchema
): Type<PipeTransform> {
  class MixinJoiValidationPipe implements PipeTransform {
    constructor(
      @Inject(forwardRef(() => WINSTON_MODULE_PROVIDER))
      private readonly logger: Logger
    ) {}
    transform(value: any, metadata: ArgumentMetadata) {
      const { error } = schema.validate(value);
      if (error) {
        this.logger.info(
          `validation error in ${metadata.data} ${error.message}`
        );
        throw new BadRequestException(`Validation failed ${error.message}`);
      }
      return value;
    }
  }
  return mixin<PipeTransform>(MixinJoiValidationPipe);
}
