const theme = {
  chipsContainer: {
    display: "flex",
    position: "relative",
    border: '1px solid #ccc',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    backgroundColor: '#fff',
    font: "13.33333px Arial",
    minHeight: 24,
    alignItems: "center",
    flexWrap: "wrap",
    padding: "2.5px",
    borderRadius: 0
  },
  container:{
    flex: 1,
  },
  containerOpen: {

  },
  input: {
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    padding: 5,
    margin: 2.5
  },
  suggestionsContainer: {
    backgroundColor:'#FFFFFF'
  },
  suggestionsList: {
    position: 'absolute',
    border: '1px solid #F0F0F1',
    zIndex: 10,
    left: 0,
    top: '100%',
    width: '100%',
    backgroundColor: '#fff',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  suggestion: {
    padding: '7px 16px 0px 16px',
    height:'32px'
  },
  suggestionHighlighted: {
    background: '#CAC9C7',
    color:'#55565A'
  },
  sectionContainer: {

  },
  sectionTitle: {

  },
}

export default theme;


