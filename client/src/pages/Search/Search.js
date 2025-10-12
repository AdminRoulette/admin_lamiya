import React, {useEffect} from 'react';
import SearchList from "./SearchList";
import {useParams} from "react-router-dom";

const Search = () => {
    const {searchParam} = useParams();
    useEffect(() => {
        document.title = searchParam === 'result' ? "Результати пошуку" : "";
    }, []);
    return (
        <>
            {searchParam === "result"
                ? <SearchList/>
                    : <></>}
        </>

    );
};

export default Search;