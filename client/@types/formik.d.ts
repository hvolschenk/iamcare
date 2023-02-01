/**
 * This is specifically a fix for `formik` being behind.
 * See: https://github.com/jaredpalmer/formik/issues/3546
 */
declare global {
  namespace React {
    type StatelessComponent<P> = React.FunctionComponent<P>;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
