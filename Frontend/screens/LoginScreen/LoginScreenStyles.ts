import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    icon2: {
        marginRight: 10,
    },
    eye: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "90%",
        justifyContent: 'center',
        marginBottom: "5%"
    },
    puscica: {
        position: 'absolute',
        left: 10,
        top: 10,
        marginTop: "10%",
        marginLeft: "1%"
    },

    lined: {
        textDecorationLine: 'underline',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#648983',
        fontSize: 16,
        paddingVertical: 2,
        marginVertical: 20,
        paddingHorizontal: 5,
        color: "#648983",
        width: "70%",
    },
    signin: {
        color: '#b6c9c5',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: '10%',
    },
    icon: {
        borderBottomWidth: 1,
        borderBottomColor: '#648983',
        paddingVertical: 3,
        paddingHorizontal: 5,
    },
    container: {

        flex: 1,
        backgroundColor: '#134b3f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    or: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: "40%",
        margin: "10%",
        marginBottom: '10%',
        display: "flex",
        justifyItems: 'center'
    },
    line: {
        width: "20%",
        height: 1,
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: '#648983',
    },
    oval: {
        width: 35,
        height: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#648983',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: "center",
        flexDirection: 'row',
        display: 'flex',
    },
    text: {
        fontSize: 10,
        color: '#648983',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button1: {
        color: 'white',
        backgroundColor: '#30312c',
        width: '70%',
        height: 45,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button2: {
        backgroundColor: 'black',
        width: '70%',
        height: 45,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10%',
        display: "flex",
        justifyItems: 'center'
    },
    googleButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        textTransform: 'uppercase',
        fontSize: 10,
        color: 'white',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});