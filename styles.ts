export const STYLES = {
    menuContainer: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '9999',
        backgroundColor: '#1C2733',
        border: '1px solid #2E4052',
        borderRadius: '4px',
        padding: '10px',
        color: '#fff',
        display: 'none' // Initially hidden
    },
    menuHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#a0a0a0',
        marginBottom: '20px',
    },
    closeButton: {
        cursor: 'pointer',
        marginLeft: 'auto',
        fontSize: '10px'
    },
    button: {
        display: 'block',
        backgroundColor: '#2A66DD',
        color: '#fff',
        border: 'none',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    featureTogglesList: {
        listStyleType: 'none',
        marginTop: '10px',
        fontSize: '12px',
        color: '#a0a0a0',
    },
    listTitle: {
        marginTop: '20px',
        color: '#a0a0a0',
        fontSize: '15px'
    }
};

export const TV_INPUT_STYLES = {
    backgroundColor: '#2A2E37',
    marginTop: '20px',
    border: '1px solid #3A3E4A',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '14px',
    padding: '8px 12px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s ease',
};

export const CONTAINER_STYLES = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
};

export const BUTTON_STYLES = {
    backgroundColor: '#2A66DD',
    marginTop: '10px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.3s ease',
};

export const BUTTON_HOVER_STYLES = {
    backgroundColor: '#1E4D8D',
};

export const AUTOCOMPLETE_STYLES = {
    backgroundColor: '#1C2733',
    border: '1px solid #2E4052',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: '#a0a0a0',
    width: '100%',
    position: 'absolute',
    zIndex: '1000',
    marginTop: '5px',
    position: 'absolute',
    top: '100%', // under input
    left: '0',
};

export const ITEM_STYLES = {
    padding: '8px',
    borderBottom: '1px solid #2E4052',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

export const ITEM_HOVER_STYLES = {
    backgroundColor: '#2A66DD',
    color: '#fff'
};
