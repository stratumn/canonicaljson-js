/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*
The original version of this code is taken from Mirko Kiefer's canonical-json:
https://github.com/mirkokiefer/canonical-json/blob/master/index.js
Modifications were made to conform to the canonicaljson spec:
https://github.com/gibson042/canonicaljson-spec
*/

import parse from './parse';
import stringify from './stringify';

module.exports = {
  stringify,
  parse
};
