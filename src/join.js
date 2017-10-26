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

// Joins all of the elements together, separated with commas, and wrap them in
// wrappers ([] or {}).
export default function(partial, wrappers, gap, mind) {
  if (partial.length === 0) {
    return wrappers;
  }
  return gap
    ? `${wrappers[0]}\n${gap}${partial.join(
        `,\n${gap}`
      )}\n${mind}${wrappers[1]}`
    : `${wrappers[0]}${partial.join(',')}${wrappers[1]}`;
}
