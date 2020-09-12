import React from 'react';
import './MyText.css';
import { throws } from 'assert';

import { IonButton, IonIcon, IonContent } from '@ionic/react';

interface ContainerProps { }

class MyText extends React.Component<{}, { lang: string, texts: any, sentenceIndex: number, title: String }> {
  constructor(props: any) {
    super(props);
    this.state = {
      lang: 'en',
      texts:
        [
          {
            'en': 'Durmstrang once had the darkest reputation of all eleven wizarding schools, though this was never entirely merited.',
            'es': 'Durmstrang alguna vez tuvo la reputación más oscura de las once escuelas mágicas, aunque esto nunca fue completamente merecido.'
          },
          {
            'en': 'It is true that Durmstrang, which has turned out many truly great witches and wizards, has twice in its history fallen under the stewardship of wizards of dubious allegiance or nefarious intent, and that it has one infamous ex-pupil.',
            'es': 'Es cierto que Durmstrang, que ha resultado ser muchas brujas y magos verdaderamente grandiosos, ha caído dos veces en su historia bajo la dirección de magos de dudosa lealtad o nefastas intenciones, y que tiene un exalumno infame.'
          },
          {
            'en': 'The first of these unhappy men, Harfang Munter, took over the school shortly after the mysterious death of its founder, the great Bulgarian witch Nerida Vulchanova.',
            'es': 'El primero de estos infelices hombres, Harfang Munter, se hizo cargo de la escuela poco después de la misteriosa muerte de su fundadora, la gran bruja búlgara Nerida Vulchanova.'
          }
        ]
      ,
      sentenceIndex: 0,
      title: 'Durmstrang'
    };

    this.goToNext = this.goToNext.bind(this);
    this.goToPrevious = this.goToPrevious.bind(this);
  }

  goToNext() {
    console.log("### Going to next!");
    this.setState(state => ({
      lang: state.lang,
      texts: state.texts,
      sentenceIndex: state.sentenceIndex + 1
    }));
  }

  goToPrevious() {
    this.setState(state => ({
      lang: state.lang,
      texts: state.texts,
      sentenceIndex: state.sentenceIndex - 1
    }));
  }

  render() {
    return <div>
        <h2>Text # {this.state.sentenceIndex}</h2>
        <p onClick={ () => {
          console.log('Old lang: ' + this.state.lang);
          let newLang;
          if (this.state.lang === 'en') {
            newLang = 'es';
          } else {
            newLang = 'en';
          }
          this.setState({
            lang: newLang,
            texts: this.state.texts,
            sentenceIndex: this.state.sentenceIndex
          });
          }
        }>
          {this.state.texts[this.state.sentenceIndex][this.state.lang]}
        </p>
        <IonButton color="primary" onClick={this.goToPrevious}>  Previous </IonButton>
        <IonButton color="secondary" onClick={this.goToNext}>  Next </IonButton>
      </div>;
  }
}

export default MyText;
