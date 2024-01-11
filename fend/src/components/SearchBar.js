import React from "react"
const SearchBar = ({searchWord,  setSearchWord, submitSearch }) => {
    return (
        <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchWord}
            onChange={setSearchWord}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={submitSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    )
}

export default SearchBar