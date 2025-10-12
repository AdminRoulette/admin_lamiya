import React from 'react';

const TtnField = ({ ttn,setTtn }) => {
    return (
        <input
            type="text"
            value={ttn?ttn:""}
            onChange={(event) =>
                setTtn(event.target.value)}
        />
    );
};

export default TtnField;
