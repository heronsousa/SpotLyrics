import React, { useState, useEffect } from 'react';
import { Text,
    TouchableOpacity, 
    View,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// import Lyrics from '../components/Lyrics';
// import Header from '../components/Header';

import card_default from '../assets/card_default.jpg'
import spotifyAPI from '../services/spotifyAPI';
import vagalumeAPI from '../services/vagalumeAPI.js';
import credentials from '../services/credentials.js';

export default function Track() {
    const [lyrics, setLyrics] = useState(' ');
    const [imageUrl, setImageUrl] = useState('');
    const [trackName, setTrackName] = useState('');
    const [trackAuthor, setTrackAuthor] = useState([]);
    const [playButton, setPlayButton] = useState('play-arrow');
    const [fontColor, setFontColor] = useState('#191414');
    const [backColor, setBackColor] = useState('white');
    const [fontScale, setFontScale] = useState(16);
    const [trackInfo, setTrackInfo] = useState({});

    useEffect(() => {
        async function getLyrics() {
            try{
                const response = await vagalumeAPI.get(`/search.php?apikey=${credentials.vagalumeAPI}&art=${trackAuthor[0]}&mus=${trackName}`);
                // console.log(response.data.mus[0].text)
                setLyrics(response.data.mus[0].text);

            } catch (err) {
                console.log(err);
            }
        }

        getLyrics();
    }, [trackName]);
    
    async function getCurrentTrack() {
        try{
            const currentTrack = await spotifyAPI.get('/currently-playing');

            setTrackAuthor(currentTrack.data?.item?.artists.map(artist => artist.name));
            setTrackName(currentTrack.data?.item?.name);
            setImageUrl(currentTrack.data?.item?.album?.images[0]?.url);

        } catch (err) {
            console.log(err);
            
            setLyrics(''); 
        }
    }

    async function play_pause() {
        await spotifyAPI.get('/currently-playing')
            .then( async (response) => {
                if(response) {
                    if(response.data.is_playing) {
                        await spotifyAPI.put('/pause');
                        setPlayButton('play-arrow')
                    }
                    else {
                        await spotifyAPI.put('/play');
                        setPlayButton('pause');
                    }
                }
            });
    }

    async function nextTrack() {
        try {
            await spotifyAPI.post('/next');
        } catch (error) {
            console.log(error)
        }
    }

    async function previousTrack() {
        try {
            await spotifyAPI.post('/previous');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <View style={styles.musicInfo}>
                
                <Image source={ imageUrl ? { uri: imageUrl } : card_default} style={styles.musicImage} />
                
                <View style={styles.musicStrigs}>
                
                    <View>
                        <Text numberOfLines={1} style={styles.musicName}>{trackName}</Text>
                        <Text numberOfLines={1} style={styles.musicAuthor}>{trackAuthor.join(', ')}</Text>
                    </View>
    
                    <View style={styles.musicButtons}>
                        
                        <TouchableOpacity onPress={previousTrack}>
                            <MaterialIcons name="skip-previous" size={35} color={'white'} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={play_pause}>
                            <MaterialIcons name={playButton} size={35} color={'white'} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={nextTrack}>
                            <MaterialIcons name="skip-next" size={35} color={'white'} />
                        </TouchableOpacity>
                        
                    </View>
    
                </View>
    
            </View>

            <TouchableOpacity onPress={getCurrentTrack}>
                <Text>Lyrics</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.lyrics}>
                <Text style={{color: fontColor, fontSize: fontScale}}>{lyrics}</Text>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    musicInfo: {
        flexDirection: 'row',
        backgroundColor: '#191414',
        padding: 15,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: 'white'
    },
    
    musicImage: {
        width: 100, 
        height: 100,
        borderWidth: 2,
        borderColor: '#fff'
    },

    musicStrigs: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 10,
        flex: 1
    },

    musicName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },

    musicAuthor: {
        fontSize: 14,
        color: '#fff'
    },

    musicButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    lyrics: {
        paddingBottom: 0,
        padding: 15
    }
});