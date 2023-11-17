import { L10n } from './types';

const en: L10n = {
  actionCancel: 'Cancel',
  actionTryAgain: 'Try again',
  applicationName: 'iamcare',
  authenticateActionLogin: 'Login',
  authenticateAlertNoRegistrationRequired:
    'No registration required, you can log in and use {applicationName} immediately',
  authenticateGoogleActionLogin: 'Login with Google',
  authenticateGoogleErrorLoginFailed: 'There was an error while logging you in',
  authenticateProviderErrorLoading:
    'Failed to load the authentication provider',
  authentication: 'Authentication',
  errorLoading: 'Error loading',
  home: 'Home',
  itemCategoryErrorRequired: 'Please select a category for the item',
  itemCategoryHelperText:
    'Please select a category for this item to be grouped under',
  itemCategoryLabel: 'Category',
  itemContactGiver: 'Contact giver',
  itemCreateActionPrimary: 'Create item',
  itemCreatePageTitle: 'Create item',
  itemCreateSuccess: "The item '{itemName}' has been created successfully",
  itemDeleteAction: 'Delete item',
  itemDeleteConfirmation:
    "Are you sure you want to delete the item '{itemName}'? This action is permanent and cannot be undone.",
  itemDeleteErrorDeleting: 'Failed to delete the item. Please try again.',
  itemDeleteSuccess: 'The item has been deleted successfully',
  itemDeleteTitle: "Delete item: '{itemName}'?",
  itemDescriptionHelperText:
    'A full description of your item. Please include as much information as possible. Please do not give away any personal information.',
  itemDescriptionLabel: 'Description',
  itemErrorLoading: 'The item failed to load. Please try again',
  itemFormErrorCreating: 'There was an error creating the item',
  itemFormErrorLoading:
    'The was an error loading the item form, please try again',
  itemImagesHelperText:
    'Upload one or more images showing the item that you are giving away as clearly as possible.',
  itemImagesLabel: 'Images',
  itemImagesLabelUpload: 'Add image',
  itemLocationErrorRequired: 'Please provide a location for the item',
  itemLocationHelperText: 'The suburb where this item is available',
  itemLocationLabel: 'Location',
  itemNameErrorRequired: 'An item requires a name',
  itemNameHelperText:
    'The name of the item you are giving away. Keep it short but descriptive. This is the first thing people will see about your item while browsing.',
  itemNameLabel: 'Item name',
  items: 'Items',
  itemsRefetching: 'Updating items list',
  search: 'Search',
  searchErrorLoading: 'Failed to load search results, please try again',
  searchErrorNoResults:
    'No results for {searchTerm}, please try a different term or filters',
  searchFieldClear: 'Clear search',
  searchFieldLabel: 'Search',
  searchFieldPlaceholder: 'Search for items',
  searchFilterActionFilter: 'Filter',
  searchFilterFieldDistance: 'Distance',
  searchFilterFieldDistanceAny: 'Any',
  searchFilterFieldDistanceLength: '{distance}km',
  searchFilterFieldLocation: 'Location',
  temp: 'A temporary sting',
  userErrorLoading: 'User profile failed to load. Please try again',
  userItemsCreateNew: 'Create item',
  userItemsErrorLoading: "Failed to load the user's items. Please try again",
  userItemsErrorNoItems: 'This user has not created any items',
  userItemsErrorNoItemsSelf: 'You have not created any items yet',
  userItemsManage: 'Manage my items',
  userItemsView: 'View user items',
};

export default en;
