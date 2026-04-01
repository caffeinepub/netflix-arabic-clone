import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";

actor {
  type ShowId = Nat;
  type CategoryId = Nat;

  type Show = {
    id : ShowId;
    title : Text;
    genres : [Text];
    posterUrl : Text;
    showType : ShowType;
    isNew : Bool;
    isFeatured : Bool;
  };

  module Show {
    public func compare(show1 : Show, show2 : Show) : Order.Order {
      Nat.compare(show1.id, show2.id);
    };
  };

  type ShowType = {
    #series;
    #movie;
  };

  type Category = {
    title : Text;
    showIds : [ShowId];
  };

  module Category {
    public func compare(category1 : Category, category2 : Category) : Order.Order {
      Nat.compare(category1.showIds.size(), category2.showIds.size());
    };
  };

  let shows = Map.empty<ShowId, Show>();
  let categories = Map.empty<CategoryId, Category>();

  public query ({ caller }) func getAllShows() : async [Show] {
    shows.values().toArray().sort();
  };

  public query ({ caller }) func getFeaturedShow() : async ?Show {
    let featured = shows.values().filter(func(show) { show.isFeatured }).toArray();
    if (featured.size() == 0) { null } else {
      ?featured[0];
    };
  };

  public query ({ caller }) func getShowsByCategory(categoryId : CategoryId) : async [Show] {
    switch (categories.get(categoryId)) {
      case (?category) {
        category.showIds.map(
          func(id) {
            switch (shows.get(id)) {
              case (?show) { show };
              case (null) { Runtime.trap("Show with id " # id.toText() # " not found") };
            };
          }
        );
      };
      case (null) { Runtime.trap("Category not found") };
    };
  };
};
