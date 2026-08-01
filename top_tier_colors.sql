-- Set Top Tier Baseball brand colors
-- Primary: navy #1e2d5e | Secondary: red #c8102e
update organizations
set
  primary_color   = '#1e2d5e',
  secondary_color = '#c8102e'
where name ilike '%top tier%';
