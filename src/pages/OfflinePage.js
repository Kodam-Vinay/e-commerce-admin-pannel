const OfflinePage = () => {
  return (
    <>
      <div>You are offline please connect to the internet</div>
      <button onClick={() => window.location.reload(true)}>Refresh</button>
    </>
  );
};

export default OfflinePage;
