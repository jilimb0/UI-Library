declare module '@ui-construction-library/registry' {
  export const foundationalComponents: any[];
  export function getComponentById(id: string): any;
  export type RegistryComponent = any;
}
