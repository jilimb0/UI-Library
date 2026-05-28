export declare const schemas: {
  readonly component: {
    $schema: string;
    $id: string;
    title: string;
    type: string;
    required: string[];
    properties: {
      id: {
        type: string;
        minLength: number;
      };
      slug: {
        type: string;
        minLength: number;
      };
      displayName: {
        type: string;
        minLength: number;
      };
      package: {
        type: string;
        minLength: number;
      };
      version: {
        type: string;
        minLength: number;
      };
      category: {
        type: string;
        minLength: number;
      };
      description: {
        type: string;
      };
      status: {
        type: string;
        enum: string[];
      };
      tags: {
        type: string;
        items: {
          type: string;
        };
      };
      props: {
        type: string;
        items: {
          type: string;
          required: string[];
          properties: {
            name: {
              type: string;
              minLength: number;
            };
            type: {
              type: string;
              minLength: number;
            };
            required: {
              type: string;
            };
            description: {
              type: string;
            };
            defaultValue: {
              type: string;
            };
          };
          additionalProperties: boolean;
        };
      };
      slots: {
        type: string;
        items: {
          type: string;
        };
      };
      events: {
        type: string;
        items: {
          type: string;
        };
      };
      states: {
        type: string;
        items: {
          type: string;
        };
      };
      a11y: {
        type: string;
        properties: {
          role: {
            type: string;
          };
          ariaRequired: {
            type: string;
            items: {
              type: string;
            };
          };
          keyboard: {
            type: string;
            items: {
              type: string;
            };
          };
          focusBehavior: {
            type: string;
          };
          screenReaderNotes: {
            type: string;
            items: {
              type: string;
            };
          };
          invalidCombinations: {
            type: string;
            items: {
              type: string;
            };
          };
          localizationNotes: {
            type: string;
            items: {
              type: string;
            };
          };
        };
        required: string[];
        additionalProperties: boolean;
      };
      responsiveBehavior: {
        type: string;
        items: {
          type: string;
        };
      };
      styleHooks: {
        type: string;
        items: {
          type: string;
        };
      };
      builder: {
        type: string;
        required: string[];
        properties: {
          editingSurface: {
            type: string;
            enum: string[];
          };
          allowChildren: {
            type: string;
          };
          insertionRules: {
            type: string;
            properties: {
              allowedParentIds: {
                type: string;
                items: {
                  type: string;
                };
              };
              blockedParentIds: {
                type: string;
                items: {
                  type: string;
                };
              };
              blockedInsideInteractive: {
                type: string;
              };
              requiresSelectedParent: {
                type: string;
              };
            };
            additionalProperties: boolean;
          };
        };
        additionalProperties: boolean;
      };
      recipes: {
        type: string;
        items: {
          type: string;
          required: string[];
          properties: {
            id: {
              type: string;
              minLength: number;
            };
            label: {
              type: string;
              minLength: number;
            };
            description: {
              type: string;
            };
            requiredProps: {
              type: string;
              items: {
                type: string;
              };
            };
            recommendedDefaults: {
              type: string;
            };
            a11yCaveats: {
              type: string;
              items: {
                type: string;
              };
            };
            doExample: {
              type: string;
            };
            dontExample: {
              type: string;
            };
          };
          additionalProperties: boolean;
        };
      };
      antiPatterns: {
        type: string;
        items: {
          type: string;
          required: string[];
          properties: {
            id: {
              type: string;
              minLength: number;
            };
            description: {
              type: string;
            };
            reason: {
              type: string;
            };
            fix: {
              type: string;
            };
          };
          additionalProperties: boolean;
        };
      };
      export: {
        type: string;
        required: string[];
        properties: {
          react: {
            type: string;
            enum: string[];
          };
          next: {
            type: string;
            enum: string[];
          };
        };
        additionalProperties: boolean;
      };
      compatibility: {
        type: string;
        required: string[];
        properties: {
          react: {
            type: string;
          };
          next: {
            type: string;
          };
          static: {
            type: string;
          };
          webComponents: {
            type: string;
          };
          vue: {
            type: string;
          };
          angular: {
            type: string;
          };
        };
        additionalProperties: boolean;
      };
    };
    additionalProperties: boolean;
  };
  readonly layout: {
    $schema: string;
    $id: string;
    title: string;
    type: string;
    required: string[];
    properties: {
      id: {
        type: string;
        minLength: number;
      };
      componentId: {
        type: string;
        minLength: number;
      };
      props: {
        type: string;
      };
      bindings: {
        type: string;
      };
      children: {
        type: string;
        items: {
          $ref: string;
        };
      };
    };
    additionalProperties: boolean;
  };
  readonly project: {
    $schema: string;
    $id: string;
    title: string;
    type: string;
    required: string[];
    properties: {
      id: {
        type: string;
        minLength: number;
      };
      name: {
        type: string;
        minLength: number;
      };
      pages: {
        type: string;
        items: {
          type: string;
          required: string[];
          properties: {
            id: {
              type: string;
            };
            title: {
              type: string;
            };
            root: {
              $ref: string;
            };
          };
        };
      };
    };
    additionalProperties: boolean;
  };
};
export type SchemaName = keyof typeof schemas;
export declare function hasRequiredKeys(
  input: Record<string, unknown>,
  requiredKeys: readonly string[]
): boolean;
export declare function validateRequiredShape(
  name: SchemaName,
  input: unknown
): boolean;
export declare function validateFullShape(
  name: SchemaName,
  input: unknown
): {
  valid: boolean;
  missing: string[];
};
declare const VALID_EDITING_SURFACES: readonly [
  'inline-editable',
  'prop-driven',
  'data-bound',
  'layout-container',
  'section-block',
  'overlay',
  'advanced',
];
export type EditingSurface = (typeof VALID_EDITING_SURFACES)[number];
export declare function isValidEditingSurface(
  value: unknown
): value is EditingSurface;
