import "styled-components";
import { theme } from "../helpers/theme/theme";

type Theme = typeof theme;

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}
