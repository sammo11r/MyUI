/**
 * Authentication configuration
 */
export interface AuthEnabledComponentConfig {
  auth: boolean;
}
  
  
/**
 * A component with authentication configuration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentWithAuth<PropsType = any> = React.FC<PropsType> &
  AuthEnabledComponentConfig;