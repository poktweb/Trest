export enum TypeKind {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  FUNCTION = 'function',
  OBJECT = 'object',
  NULL = 'null',
  ANY = 'any',
  UNION = 'union',
  OPTIONAL = 'optional',
}

export interface Type {
  kind: TypeKind;
  elementType?: Type; // Para arrays
  parameterTypes?: Type[]; // Para funções
  returnType?: Type; // Para funções
  properties?: Map<string, Type>; // Para objetos
  unionTypes?: Type[]; // Para uniões
}

export class TypeChecker {
  private types: Map<string, Type> = new Map();

  public inferType(value: any): Type {
    if (value === null || value === undefined) {
      return { kind: TypeKind.NULL };
    }
    if (typeof value === 'number') {
      return { kind: TypeKind.NUMBER };
    }
    if (typeof value === 'string') {
      return { kind: TypeKind.STRING };
    }
    if (typeof value === 'boolean') {
      return { kind: TypeKind.BOOLEAN };
    }
    if (Array.isArray(value)) {
      const elementType = value.length > 0 ? this.inferType(value[0]) : { kind: TypeKind.ANY };
      return { kind: TypeKind.ARRAY, elementType };
    }
    if (typeof value === 'object' && 'type' in value && value.type === 'function') {
      return {
        kind: TypeKind.FUNCTION,
        parameterTypes: value.params.map(() => ({ kind: TypeKind.ANY })),
        returnType: { kind: TypeKind.ANY },
      };
    }
    return { kind: TypeKind.ANY };
  }

  public isAssignable(target: Type, source: Type): boolean {
    if (target.kind === TypeKind.ANY || source.kind === TypeKind.ANY) {
      return true;
    }

    if (target.kind === source.kind) {
      if (target.kind === TypeKind.ARRAY) {
        return (
          !target.elementType ||
          !source.elementType ||
          this.isAssignable(target.elementType, source.elementType)
        );
      }
      if (target.kind === TypeKind.FUNCTION) {
        return (
          (!target.returnType || !source.returnType ||
            this.isAssignable(target.returnType, source.returnType)) &&
          (!target.parameterTypes || !source.parameterTypes ||
            this.arraysEqual(target.parameterTypes, source.parameterTypes, this.isAssignable.bind(this)))
        );
      }
      return true;
    }

    if (target.kind === TypeKind.UNION && target.unionTypes) {
      return target.unionTypes.some((t) => this.isAssignable(t, source));
    }

    if (source.kind === TypeKind.NULL && target.kind === TypeKind.OPTIONAL) {
      return true;
    }

    return false;
  }

  private arraysEqual<T>(a: T[], b: T[], compare: (a: T, b: T) => boolean): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, i) => compare(val, b[i]));
  }

  public registerType(name: string, type: Type): void {
    this.types.set(name, type);
  }

  public getType(name: string): Type | undefined {
    return this.types.get(name);
  }
}

