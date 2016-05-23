<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

    public $timestamps = false;
    protected $hidden = ['pivot'];

    /**
     * Many-to-Many.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * An role is owned by multiple users
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role_id', 'user_id');
    }
}
