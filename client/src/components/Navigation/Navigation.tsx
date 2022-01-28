import { Link } from "react-router-dom";
import * as S from "./Navigation.style";

/* 
    Route names and endpoints.
    Make sure that everything from app.tsx that we want to expose is included here
*/
const routes: Record<string, string> = {
    tickets: "Tickets",
    ticker: "Ticker",
};

type ListItemProps = {
    path: string;
    pathLabel?: string;
};

/**
 * Capitalize the first character of a string
 */
function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

function ListItem({ path, pathLabel }: ListItemProps) {
    const label = pathLabel ?? capitalize(path);

    return (
        <S.ListItem>
            <Link to={path}>{label}</Link>
        </S.ListItem>
    );
}

const listItems = Object.entries(routes).map(([path, label]) => {
    return <ListItem key={path} path={path} pathLabel={label} />;
});

function Navigation() {
    return (
        <S.Wrapper>
            <S.NavList>{listItems}</S.NavList>
        </S.Wrapper>
    );
}

export default Navigation;
