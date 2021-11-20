import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Nav from './Nav';
import './App.css';
import { List, Avatar } from 'antd';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([]);
  const [selectedLang, setSelectedLang] = useState(props.selectedLang);

  //RECUPERER LA LANGUE DE L'USER EN BDD
  useEffect(() => {
    const findLang = async () => {

      const reqFind = await fetch(`/user-lang?token=${props.token}`);
      const resultFind = await reqFind.json();

      setSelectedLang(resultFind.lang);
    }

    findLang();
  }, [])

  //CHARGER LES ARTICLES VIA L'API SELON LA LANGUE DE L'USER
  useEffect(() => {
    const APIResultsLoading = async () => {
      let langue = 'fr';
      let country = 'fr';

      if (selectedLang == 'en') {
        langue = 'en';
        country = 'us';
      }

      props.changeLang(selectedLang);
      const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=b32c8b844d1243b1a7998d8228910f50`);
      const body = await data.json();
      setSourceList(body.sources);
    }

    APIResultsLoading();
  }, [selectedLang]);

  //MODIFIER LA LANGUE EN BDD
  const updateLang = async (lang) => {

    setSelectedLang(lang);

    const reqLang = await fetch('/user-lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `lang=${lang}&token=${props.token}`
    })
  }

  //MODIFIER LA BORDURE SELON LANGUE SELECTIONNEE
  let styleBorderFr = { width: '40px', margin: '10px', cursor: 'pointer' };
  let styleBorderEn = { width: '40px', margin: '10px', cursor: 'pointer' };

  if (selectedLang == 'fr') {
    styleBorderFr.border = '1px solid black'
  } else {
    styleBorderEn.border = '1px solid black'
  }

  return (
    <div>
      <Nav />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="Banner">
        <img style={styleBorderFr} src='/images/fr.png' onClick={() => updateLang('fr')} />
        <img style={styleBorderEn} src='/images/uk.png' onClick={() => updateLang('en')} />
      </div>

      <div className="HomeThemes">

        <List
          itemLayout="horizontal"
          dataSource={sourceList}
          renderItem={source => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`/images/${source.category}.png`} />}
                title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                description={source.description}
              />
            </List.Item>
          )}
        />

      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { selectedLang: state.selectedLang, token: state.token }
}

function mapDispatchToProps(dispatch) {
  return {
    changeLang: function (selectedLang) {
      dispatch({ type: 'changeLang', selectedLang: selectedLang })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)
