import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        height: 80,
        width: 80,
        marginBottom: 50
    },

    button: {
        height: 50,
        width: 280,
        borderWidth: 3,
        borderColor: '#191414',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },

    buttonText: {
        color: '#191414',
        fontSize: 16,
        fontWeight: 'bold'
    }
});