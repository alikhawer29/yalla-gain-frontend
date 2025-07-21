import React, { useEffect, useRef } from 'react';

const AdvancedMarker = ({ position, map }) => {
    const markerRef = useRef(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            map,
        });

        markerRef.current = marker;

        return () => {
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
        };
    }, [position, map]);

    return null;
};

export default AdvancedMarker;
