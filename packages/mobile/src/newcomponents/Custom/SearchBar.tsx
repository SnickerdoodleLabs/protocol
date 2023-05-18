import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";

const SearchBar = ({ onSearch,onClickCategoryFilter }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch(text);
    // Perform search action here using the searchText value
  };

  return (
    <View style={styles.searchBar}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          placeholder="Search NFT, creator, collection, ..."
          placeholderTextColor="#aaa"
          onChangeText={handleSearch}
          value={searchText}
          style={styles.input}
        />
      {/*   <TouchableOpacity style={{paddingRight:20}} onPress={onClickCategoryFilter}>
          <Image source={require("../../assets/images/search-filter.png")} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#F5F5F5",
    height: normalizeHeight(56),
    borderRadius: 8,
    marginRight: 20,
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    paddingVertical: normalizeHeight(18),
    paddingHorizontal: normalizeWidth(16),
  },
});

export default SearchBar;
