export const topicPrimaryStyle = (theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      color: '#555',
    },
    tab: {
      backgroundColor: theme.palette.primary[500],
      textAlign: 'center',
      display: 'inline-block',
      padding: '0 6px',
      color: '#fff',
      borderRadius: 3,
      marginRight: 10,
      fontSize: '12px',
    },
    good: {
      backgroundColor: theme.palette.grey[600],
    },
    top: {
      // backgroundColor: '#e91e63',
      backgroundColor: theme.palette.secondary[500],
    },
  }
}

export const topicSecondaryStyle = (theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 3,
    },
    count: {
      textAlign: 'center',
      marginRight: 20,
    },
    userName: {
      marginRight: 20,
      color: '#9e9e9e',
    },
    accentColor: {
      color: theme.palette.secondary[500],
    },
  }
}


export const topicListStyle = () => {
  return {
    root: {
      margin: 24,
      marginTop: 80,
    },
    loading: {
      display: 'flex',
      justifyContent: 'space-around',
    },
  }
}
