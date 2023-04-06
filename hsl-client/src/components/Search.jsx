const Search = ({ handleSearch }) => {
  return (
    <div>
      <input
        placeholder="Search..."
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default Search;
