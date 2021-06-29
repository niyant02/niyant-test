import { useState } from 'react';
import { Input } from 'antd';

import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

export const GoogleAutoComplete = (props: any) => {
    const { getPlacePredictions, isPlacePredictionsLoading } = useGoogle({
        apiKey: process.env.REACT_APP_GOOGLE,
    });
    const [value, setValue] = useState('');

    return (
        <>
            <Input.Search
                {...props}
                value={value}
                placeholder="enter your location"
                onChange={(evt) => {
                    getPlacePredictions({ input: evt.target.value });
                    setValue(evt.target.value);
                }}
                loading={isPlacePredictionsLoading}
            />
            {/* <div
                style={{
                    marginTop: '20px',
                    width: '200px',
                    height: '200px',
                    display: 'flex',
                    flex: '1',
                    flexDirection: 'column',
                    marginBottom: '100px',
                }}
            >
                {!isPlacePredictionsLoading && (
                    <List
                        dataSource={placePredictions}
                        renderItem={(item) => (
                            <List.Item onClick={() => setValue(item.description)}>
                                <List.Item.Meta title={item.description} />
                            </List.Item>
                        )}
                    />
                )}
            </div> */}
        </>
    );
};
