module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true
    },
    extends: ['prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module'
    },
    plugins: [
      'eslint-plugin-import',
      'eslint-plugin-unicorn',
      '@angular-eslint/eslint-plugin',
      'eslint-plugin-jsdoc',
      'eslint-plugin-prefer-arrow',
      'eslint-plugin-react',
      '@typescript-eslint',
      '@typescript-eslint/tslint'
    ],
    root: true,
    rules: {
      '@angular-eslint/component-class-suffix': 'warn',
      '@angular-eslint/component-selector': [
        'warn',
        {
          type: 'element',
          style: 'kebab-case'
        }
      ],
      '@angular-eslint/directive-class-suffix': 'warn',
      '@angular-eslint/directive-selector': [
        'warn',
        {
          type: 'attribute',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/no-host-metadata-property': 'warn',
      '@angular-eslint/no-input-rename': 'warn',
      '@angular-eslint/no-inputs-metadata-property': 'warn',
      '@angular-eslint/no-output-on-prefix': 'warn',
      '@angular-eslint/no-output-rename': 'warn',
      '@angular-eslint/no-outputs-metadata-property': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'warn',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/use-pipe-transform-interface': 'warn',
      '@typescript-eslint/adjacent-overload-signatures': 'warn',
      '@typescript-eslint/array-type': [
        'warn',
        {
          default: 'array'
        }
      ],
      '@typescript-eslint/ban-types': [
        'warn',
        {
          types: {
            Object: {
              message: 'Avoid using the `Object` type. Did you mean `object`?'
            },
            Function: {
              message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
            },
            Boolean: {
              message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
            },
            Number: {
              message: 'Avoid using the `Number` type. Did you mean `number`?'
            },
            String: {
              message: 'Avoid using the `String` type. Did you mean `string`?'
            },
            Symbol: {
              message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
            }
          }
        }
      ],
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-definitions': 'warn',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'off',
        {
          accessibility: 'explicit'
        }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      indent: 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false
          }
        }
      ],
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid'
        }
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': [
        'warn',
        {
          ignoreParameters: true
        }
      ],
      '@typescript-eslint/no-misused-new': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-shadow': [
        'warn',
        {
          hoist: 'all'
        }
      ],
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-namespace-keyword': 'warn',
      '@typescript-eslint/semi': ['warn', 'always'],
      '@typescript-eslint/triple-slash-reference': [
        'warn',
        {
          path: 'always',
          types: 'prefer-import',
          lib: 'always'
        }
      ],
      '@typescript-eslint/tslint/config': [
        'error',
        {
          rules: {
            'import-spacing': true,
            whitespace: true
          }
        }
      ],
      '@typescript-eslint/type-annotation-spacing': 'warn',
      '@typescript-eslint/typedef': 'off',
      '@typescript-eslint/unified-signatures': 'warn',
      'arrow-body-style': 'warn',
      'arrow-parens': ['off', 'always'],
      'brace-style': ['warn', '1tbs'],
      complexity: 'off',
      'constructor-super': 'warn',
      curly: 'warn',
      'dot-notation': 'off',
      'eol-last': 'warn',
      eqeqeq: ['warn', 'smart'],
      'guard-for-in': 'warn',
      'id-denylist': 'off',
      'id-match': 'off',
      'import/no-deprecated': 'warn',
      'import/no-extraneous-dependencies': 'warn',
      'import/no-internal-modules': 'off',
      'jsdoc/check-alignment': 'warn',
      'jsdoc/check-indentation': 'warn',
      'jsdoc/newline-after-description': 'off',
      'max-classes-per-file': 'off',
      'max-len': [
        'warn',
        {
          code: 200
        }
      ],
      'no-bitwise': 'warn',
      'no-caller': 'warn',
      'no-cond-assign': 'warn',
      'no-console': [
        'warn',
        {
          allow: [
            'log',
            'warn',
            'dir',
            'timeLog',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupEnd',
            'table',
            'dirxml',
            'error',
            'groupCollapsed',
            'Console',
            'profile',
            'profileEnd',
            'timeStamp',
            'context'
          ]
        }
      ],
      'no-debugger': 'warn',
      'no-duplicate-case': 'warn',
      'no-duplicate-imports': 'warn',
      'no-empty': 'off',
      'no-empty-function': 'off',
      'no-eval': 'warn',
      'no-extra-bind': 'warn',
      'no-fallthrough': 'warn',
      'no-invalid-this': 'off',
      'no-irregular-whitespace': 'off',
      'no-new-func': 'warn',
      'no-new-wrappers': 'warn',
      'no-redeclare': 'warn',
      'no-restricted-imports': ['warn', 'rxjs/Rx'],
      'no-return-await': 'warn',
      'no-sequences': 'warn',
      'no-shadow': 'off',
      'no-sparse-arrays': 'warn',
      'no-template-curly-in-string': 'warn',
      'no-throw-literal': 'warn',
      'no-trailing-spaces': 'warn',
      'no-undef-init': 'warn',
      'no-underscore-dangle': 'off',
      'no-unsafe-finally': 'warn',
      'no-unused-expressions': 'off',
      'no-unused-labels': 'warn',
      'no-use-before-define': 'off',
      'no-var': 'warn',
      'object-shorthand': 'off',
      'one-var': ['warn', 'never'],
      'padded-blocks': [
        'off',
        {
          blocks: 'never'
        },
        {
          allowSingleLineBlocks: true
        }
      ],
      'prefer-arrow/prefer-arrow-functions': 'warn',
      'prefer-const': 'warn',
      'prefer-object-spread': 'off',
      radix: 'warn',
      'react/jsx-tag-spacing': [
        'off',
        {
          afterOpening: 'allow',
          closingSlash: 'allow'
        }
      ],
      'space-in-parens': ['off', 'never'],
      'spaced-comment': [
        'warn',
        'always',
        {
          markers: ['/']
        }
      ],
      'unicorn/prefer-ternary': 'off',
      'use-isnan': 'warn',
      'valid-typeof': 'warn',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',
      'no-nested-ternary': 'warn'
    }
  };
  