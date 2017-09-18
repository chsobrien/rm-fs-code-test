from pyramid.response import Response
from pyramid.view import view_config
import json
import csv


# /
@view_config(route_name='home', renderer='home.pt')
def home(request):
    return {}

# /foo
@view_config(route_name='foo', renderer='json')
def foo(request):
    return {
        'data': 'bar'
    }

# /data
@view_config(route_name='data', renderer='json', request_method='GET')
def get_data(request):
    # Add this code anywhere you need to enable CORS
    headers = (
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Credentials', 'true'),
        ('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With'),
        ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    )
    request.response.headerlist.extend(headers)
    
    propertyData = []
    key_column_index_dict = {'PROP_NAME': None, 'ADDRESS': None, 'CITY': None, 'STATE_ID': None, 'ZIP': None}
    
    with open('sampleapp_be/assets/properties.csv') as file:
        data = csv.reader(file)
        is_first_row = True 
        for row in data:
            #record column index for each required key
            if is_first_row:
                index = 0
                for k in row:
                    if k == 'PROP_NAME':
                        key_column_index_dict['PROP_NAME'] = index
                    elif k == 'ADDRESS':
                        key_column_index_dict['ADDRESS'] = index
                    elif k == 'CITY':
                        key_column_index_dict['CITY'] = index
                    elif k == 'STATE_ID':
                        key_column_index_dict['STATE_ID'] = index
                    elif k == 'ZIP':
                        key_column_index_dict['ZIP'] = index
                    else:
                        pass   
                    index += 1
                is_first_row = False
            #construct json object containing required fields
            else:
                if row[key_column_index_dict['STATE_ID']].lower() == 'ca':
                    
                    #calculate values for MISSING_FIELD_COUNT & MISSING_DATA_ENCODING keys
                    missing_field_count = 0
                    missing_data_encoding = None #possible issue: when complete this variable's value will be contingent on the order the attributes in the properties.csv file; however, the json object might not reflect the file's order as json doesn't guarantee order of attributes
                    missing_data_encoding_list = [] #holds value existence streak to be concatenated into 1 integer once all pairs examined
                    is_first_pair = True
                    key_has_no_value = False #reflects the existence state of the pair value in the previous pair
                    value_existence_streak = 0 
                    for key in key_column_index_dict:
                        if is_first_pair:
                            if row[key_column_index_dict[key]] == '':
                                missing_field_count += 1
                                key_has_no_value = True
                            value_existence_streak += 1
                            is_first_pair = False
                        else:
                            if row[key_column_index_dict[key]] == '':
                                missing_field_count += 1
                                if key_has_no_value == True:
                                    value_existence_streak += 1
                                else:
                                    key_has_no_value = True
                                    missing_data_encoding_list.append(value_existence_streak)
                                    value_existence_streak = 1
                            else:
                                if key_has_no_value == True:
                                    key_has_no_value = False
                                    missing_data_encoding_list.append(value_existence_streak)
                                    value_existence_streak = 1
                                else:
                                    value_existence_streak += 1
                    missing_data_encoding_list.append(value_existence_streak)
                    
                    #concatenate value existence streaks into 1 integer
                    if(value_existence_streak == len(key_column_index_dict)):
                        missing_data_encoding = value_existence_streak
                    else:
                        is_first_streak = True
                        for streak in missing_data_encoding_list:
                            if is_first_streak:
                                missing_data_encoding = streak
                                is_first_streak = False
                            else:
                                missing_data_encoding = int(str(missing_data_encoding) + str(streak))
    
                    record = {"PROP_NAME": row[key_column_index_dict['PROP_NAME']], "ADDRESS": row[key_column_index_dict['ADDRESS']], "CITY": row[key_column_index_dict['CITY']], "STATE_ID": row[key_column_index_dict['STATE_ID']], "ZIP": row[key_column_index_dict['ZIP']], "MISSING_FIELD_COUNT": missing_field_count, "MISSING_DATA_ENCODING": missing_data_encoding}
                    propertyData.append(record)
                    
    json.dumps(propertyData) #serialize propertyData to JSON format
    return propertyData