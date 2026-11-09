import nx from '@nx/eslint-plugin';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist', '**/node_modules', '**/.angular', '**/coverage'] },
  ...nx.configs['flat/base'],
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['jvx', 'ngJvx', 'lib', 'app'], style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: ['ng-jvx', 'lib', 'app'], style: 'kebab-case' }
      ],
      // Regole che richiedono refactoring con impatto sull'API pubblica o sul comportamento
      // (tipi `any`, nomi degli output, injection, change detection, standalone): segnalate come
      // warning in attesa di un intervento dedicato.
      // Parametri non usati: firme imposte da interfacce/callback (ControlValueAccessor, handler)
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@angular-eslint/prefer-inject': 'warn',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/prefer-standalone': 'warn',
      '@angular-eslint/no-output-on-prefix': 'warn'
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // Accessibilita' e control flow: da affrontare con una modifica dedicata dei template
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
      '@angular-eslint/template/prefer-control-flow': 'warn'
    }
  }
);
